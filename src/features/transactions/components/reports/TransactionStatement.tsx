import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment, { Moment } from "moment";

// Matches --primary in index.css (react-pdf can't read CSS variables).
const BRAND = "#3b82f6";
const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";
const SOFT = "#f3f4f6";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingHorizontal: 36,
    paddingBottom: 60,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: INK,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 12,
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
  },
  brand: { fontSize: 20, fontFamily: "Helvetica-Bold", color: BRAND },
  subBrand: {
    fontSize: 8,
    color: MUTED,
    marginTop: 3,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  generatedAt: { fontSize: 8, color: MUTED },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: SOFT,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  metaLabel: {
    fontSize: 7,
    color: MUTED,
    marginBottom: 3,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  metaValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  summaryCardAccent: { backgroundColor: BRAND, borderColor: BRAND },
  summaryLabel: {
    fontSize: 7,
    color: MUTED,
    marginBottom: 4,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  summaryValue: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  credit: { color: "#0f6e56" },
  debit: { color: "#b42318" },
  table: { width: "100%" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: BRAND,
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: LINE,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRowAlt: { backgroundColor: "#f9fafb" },
  colDate: { width: "16%" },
  colDesc: { width: "38%", paddingRight: 6 },
  colCredit: { width: "15%", textAlign: "right" },
  colDebit: { width: "15%", textAlign: "right" },
  colBalance: { width: "16%", textAlign: "right", fontFamily: "Helvetica-Bold" },
  headerCell: {
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  category: { fontSize: 7, color: MUTED, marginTop: 2 },
  empty: { textAlign: "center", color: MUTED, paddingVertical: 24 },
  footer: {
    position: "absolute",
    left: 36,
    right: 36,
    bottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: LINE,
    paddingTop: 8,
    fontSize: 7,
    color: MUTED,
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
          <Text style={styles.summaryValue}>
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
        <View style={[styles.summaryCard, styles.summaryCardAccent]}>
          <Text style={[styles.summaryLabel, { color: "#d1fae5" }]}>
            Closing
          </Text>
          <Text style={[styles.summaryValue, { color: "#ffffff" }]}>
            {formatCurrency(closingBalance, currency, "code")}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeaderRow} fixed>
          <Text style={[styles.colDate, styles.headerCell]}>Date</Text>
          <Text style={[styles.colDesc, styles.headerCell]}>Description</Text>
          <Text style={[styles.colCredit, styles.headerCell]}>Credit</Text>
          <Text style={[styles.colDebit, styles.headerCell]}>Debit</Text>
          <Text style={[styles.colBalance, styles.headerCell]}>Balance</Text>
        </View>

        {transactions.length === 0 && (
          <Text style={styles.empty}>
            No transactions in this period.
          </Text>
        )}

        {transactions.map((tx, i) => (
          <View
            style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
            key={i}
            wrap={false}
          >
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
        <Text>Generated automatically by Trackwise · {accountName}</Text>
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
