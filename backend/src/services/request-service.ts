import { PaginatedResult } from "../types/shared.types";
import {
  CreateRequestInput,
  GetAllRequestOptions,
  RequestWithContact,
  UpdateRequestInput,
} from "../types/request.types";

import { RequestModel } from "../models/request-model";
import { ActivityLogModel } from "../models/activity-log-model";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";

export const RequestService = {
  async getAll(
    options: GetAllRequestOptions
  ): Promise<PaginatedResult<RequestWithContact>> {
    return await RequestModel.getAll(options);
  },

  async getById(requestId: number): Promise<RequestWithContact | null> {
    return await RequestModel.getWithContact(requestId);
  },

  async create(
    data: CreateRequestInput,
    authorId?: number
  ): Promise<RequestWithContact> {
    const { message, contact_id } = data;
    const exists = await RequestModel.exists(message, contact_id);

    if (exists) {
      throw new AppError(ERROR_MESSAGES.REQUEST_EXISTS, 409);
    }
    const created = await RequestModel.create(data);
    const full = await RequestModel.getWithContact(created.id);

    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.CREATE_REQUEST,
      target_type: LOG_TARGETS.REQUEST,
      target_id: created.id,
      details: {
        created,
      },
    });

    return full;
  },
  async update(
    requestId: number,
    data: UpdateRequestInput,
    authorId?: number
  ): Promise<RequestWithContact> {
    const updateRequest = await RequestModel.update(requestId, data);

    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.UPDATE_REQUEST,
      target_type: LOG_TARGETS.REQUEST,
      target_id: requestId,
      details: {
        data,
      },
    });

    return await RequestModel.getWithContact(requestId);
  },
  async delete(requestId: number, authorId?: number): Promise<number> {
    const result = await RequestModel.delete(requestId);

    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.DELETE_REQUEST,
      target_type: LOG_TARGETS.REQUEST,
      target_id: requestId,
    });

    return result;
  },
};
