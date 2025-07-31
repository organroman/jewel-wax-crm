import { formatPhone } from "@/lib/utils";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

const mmToPt = (mm: number) => mm * 2.83465;

Font.register({
  family: "Inter",
  src: "/fonts/Inter-VariableFont_opsz,wght.ttf",
  fontWeight: "normal",
});
Font.register({
  family: "Inter",
  src: "/fonts/Inter-VariableFont_opsz,wght.ttf",
  fontWeight: "bold",
});
Font.register({
  family: "Inter",
  src: "/fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
  fontStyle: "italic",
});

const styles = StyleSheet.create({
  page: {
    width: mmToPt(40), // 40mm
    height: mmToPt(30), // 30mm
    // padding: 4,
    flexDirection: "column",
    fontSize: 6,
    fontFamily: "Inter",
    justifyContent: "space-between",
    // border: "1pt dashed gray",
  },
  header: {
    backgroundColor: "black",
    color: "white",
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 7,
  },
  logo: {
    width: 30,
    height: 16,
  },
  contacts: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    alignItems: "flex-end",
  },
  content: {
    padding: 1,
    fontSize: 7,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  name: {
    fontSize: 8,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 9,
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginRight: 4,
  },

  customer: {
    display: "flex",
    gap: 3,
  },
  footer: {
    fontSize: 6,
    color: "grey",
    textAlign: "right",
    paddingRight: 4,
    paddingBottom: 2,
    paddingTop: 2,
    borderTop: "1pt dashed gray",
  },
});

const LabelPDF = ({
  name,
  phone,
  date,
}: {
  name: string;
  phone: string;
  date: string;
}) => (
  <Document>
    <Page size={[mmToPt(40), mmToPt(30)]} style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/img/logo.png" />
        <View style={styles.contacts}>
          <Text>Jewel-wax.com.ua</Text>
          <Text>+38(066) 302-60-44</Text>
          <Text>+38(093) 302-60-44</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.customer}>
          <Text>
            Клієнт: <Text style={styles.name}>{name}</Text>
          </Text>
        </View>
        <Text style={styles.phone}>{formatPhone(phone)}</Text>
      </View>
      <Text style={styles.footer}>Дата: {date}</Text>
    </Page>
  </Document>
);

export default LabelPDF;
