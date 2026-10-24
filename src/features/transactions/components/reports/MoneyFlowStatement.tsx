import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment, { Moment } from "moment";
import { styles } from "./TransactionStatement";

// Narrower columns than the account statement to fit Source and Destination
const cols = StyleSheet.create({
  date: { width: "12%" },
  desc: { width: "22%", paddingRight: 6 },
  source: { width: "14%", paddingRight: 6 },
  destination: { width: "14%", paddingRight: 6 },
  in: { width: "12%", textAlign: "right" },
  out: { width: "12%", textAlign: "right" },
  total: { width: "14%", textAlign: "right", fontFamily: "Helvetica-Bold" },
});

interface MoneyFlowTransaction {
  date: string;
  type: "Expense" | "Income" | "Transfer";
  description: string;
  from: string | null;
  to: string | null;
  change: number;
  balance: number;
}

interface MoneyFlowPDFProps {
  from: Moment;
  to: Moment;
  openingBalance: number;
  closingBalance: number;
  totalIn: number;
  totalOut: number;
  transactions: MoneyFlowTransaction[];
  currency: string;
}

const MoneyFlowPDF = ({
  from,
  to,
  openingBalance,
  closingBalance,
  totalIn,
  totalOut,
  transactions,
  currency,
}: MoneyFlowPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Trackwise</Text>
          <Text style={styles.subBrand}>Money flow report</Text>
        </View>
        <Text style={styles.generatedAt}>
          Generated on {moment().format("MMM D, YYYY h:mm A")}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View>
          <Text style={styles.metaLabel}>Scope</Text>
          <Text style={styles.metaValue}>Cash & bank accounts</Text>
        </View>
        <View>
          <Text style={styles.metaLabel}>Report period</Text>
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
          <Text style={styles.summaryLabel}>Money in</Text>
          <Text style={[styles.summaryValue, styles.credit]}>
            {formatCurrency(totalIn, currency, "code")}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Money out</Text>
          <Text style={[styles.summaryValue, styles.debit]}>
            {formatCurrency(totalOut, currency, "code")}
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
          <Text style={[cols.date, styles.headerCell]}>Date</Text>
          <Text style={[cols.desc, styles.headerCell]}>Description</Text>
          <Text style={[cols.source, styles.headerCell]}>Source</Text>
          <Text style={[cols.destination, styles.headerCell]}>Destination</Text>
          <Text style={[cols.in, styles.headerCell]}>In</Text>
          <Text style={[cols.out, styles.headerCell]}>Out</Text>
          <Text style={[cols.total, styles.headerCell]}>Total</Text>
        </View>

        {transactions.length === 0 && (
          <Text style={styles.empty}>No transactions in this period.</Text>
        )}

        {transactions.map((tx, i) => (
          <View
            style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
            key={i}
            wrap={false}
          >
            <Text style={cols.date}>
              {moment(tx.date).format("MMM D, YYYY")}
            </Text>
            <View style={cols.desc}>
              <Text>{tx.description}</Text>
              <Text style={styles.category}>{tx.type}</Text>
            </View>
            <Text style={cols.source}>{tx.from || "—"}</Text>
            <Text style={cols.destination}>{tx.to || "—"}</Text>
            <Text style={[cols.in, styles.credit]}>
              {tx.change > 0 ? formatCurrency(tx.change, currency, "code") : "—"}
            </Text>
            <Text style={[cols.out, styles.debit]}>
              {tx.change < 0
                ? formatCurrency(-tx.change, currency, "code")
                : "—"}
            </Text>
            <Text style={cols.total}>
              {formatCurrency(tx.balance, currency, "code")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer} fixed>
        <Text>Generated automatically by Trackwise · Money flow</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

export default MoneyFlowPDF;
