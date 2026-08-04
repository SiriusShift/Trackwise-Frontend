import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment, { Moment } from "moment";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 14,
  },
  brand: { fontSize: 14, fontWeight: 700 },
  subBrand: { fontSize: 8, color: "#777", marginTop: 2 },
  generatedAt: { fontSize: 7, color: "#999" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metaLabel: { fontSize: 7, color: "#999", marginBottom: 2 },
  metaValue: { fontSize: 10, fontWeight: 700 },
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
  },
  summaryLabel: { fontSize: 7, color: "#999", marginBottom: 2 },
  summaryValue: { fontSize: 10, fontWeight: 700 },
  credit: { color: "#0f6e56" },
  debit: { color: "#a32d2d" },
  table: { display: "flex", width: "100%" },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#222",
    paddingBottom: 5,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingVertical: 5,
  },
  colDate: { width: "16%" },
  colDesc: { width: "38%" },
  colCredit: { width: "15%", textAlign: "right" },
  colDebit: { width: "15%", textAlign: "right" },
  colBalance: { width: "16%", textAlign: "right", fontWeight: 700 },
  headerCell: { fontWeight: 700 },
  category: { fontSize: 7, color: "#999", marginTop: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 16,
    paddingTop: 8,
    fontSize: 7,
    color: "#999",
  },
});
interface StatementTransaction {
  date: string;
  description: string;
  category?: { name: string } | null;
  credit: number;
  debit: number;
  balance: number;
}

interface StatementPDFProps {
  accountName: string;
  from: Moment;
  to: Moment;
  openingBalance: number;
  closingBalance: number;
  totalCredit: number;
  totalDebit: number;
  transactions: StatementTransaction[];
  currency: string;
}

const StatementPDF = ({
  accountName,
  from,
  to,
  openingBalance,
  closingBalance,
  totalCredit,
  totalDebit,
  transactions,
  currency,
}: StatementPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Trackwise</Text>
          <Text style={styles.subBrand}>Transaction statement</Text>
        </View>
        <Text style={styles.generatedAt}>
          Generated on {moment().format("MMM D, YYYY h:mm A")}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View>
          <Text style={styles.metaLabel}>Account</Text>
          <Text style={styles.metaValue}>{accountName}</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>Statement period</Text>
          <Text style={styles.metaValue}>
            {moment(from).format("MMM D, YYYY")} –{" "}
            {moment(to).format("MMM D, YYYY")}
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Opening</Text>
          <Text style={[styles.summaryValue, styles.debit]}>
            {formatCurrency(openingBalance, currency, "code")}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Credit</Text>
          <Text style={[styles.summaryValue, styles.credit]}>
            {formatCurrency(totalCredit, currency, "code")}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Debit</Text>
          <Text style={[styles.summaryValue, styles.debit]}>
            {formatCurrency(totalDebit, currency, "code")}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Closing</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(closingBalance, currency, "code")}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.colDate, styles.headerCell]}>Date</Text>
          <Text style={[styles.colDesc, styles.headerCell]}>Description</Text>
          <Text style={[styles.colCredit, styles.headerCell]}>Credit</Text>
          <Text style={[styles.colDebit, styles.headerCell]}>Debit</Text>
          <Text style={[styles.colBalance, styles.headerCell]}>Balance</Text>
        </View>

        {transactions.map((tx, i) => (
          <View style={styles.tableRow} key={i} wrap={false}>
            <Text style={styles.colDate}>
              {moment(tx.date).format("MMM D, YYYY")}
            </Text>
            <View style={styles.colDesc}>
              <Text>{tx.description}</Text>
              {tx.category?.name && (
                <Text style={styles.category}>{tx.category.name}</Text>
              )}
            </View>
            <Text style={[styles.colCredit, styles.credit]}>
              {tx.credit > 0
                ? formatCurrency(tx.credit, currency, "code")
                : "—"}
            </Text>
            <Text style={[styles.colDebit, styles.debit]}>
              {tx.debit > 0 ? formatCurrency(tx.debit, currency, "code") : "—"}
            </Text>
            <Text style={styles.colBalance}>
              {formatCurrency(tx.balance, currency, "code")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer} fixed>
        <Text>Generated automatically by Trackwise.</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

export default StatementPDF;
