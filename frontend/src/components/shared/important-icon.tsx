const ImportantIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="size-5"
    fill={active ? "currentColor" : "none"}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      className={
        active ? "fill-action-alert stroke-action-alert" : "stroke-text-light"
      }
    />
    <line
      x1="12"
      x2="12"
      y1="8"
      y2="12"
      className={active ? "stroke-white" : "stroke-text-light"}
    />
    <line
      x1="12"
      x2="12.01"
      y1="16"
      y2="16"
      className={active ? "stroke-white" : "stroke-text-light"}
    />
  </svg>
);

export default ImportantIcon;
