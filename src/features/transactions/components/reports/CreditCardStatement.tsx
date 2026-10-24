import { CreditCardStatementData } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/CustomFunctions";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import { styles } from "./TransactionStatement";

const STATUS_LABELS: Record<CreditCardStatementData["status"], string> = {
  PENDING: "Unpaid",
  PARTIAL: "Partially paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

const cc = StyleSheet.create({
  overview: { flexDirection: "row", gap: 12, marginBottom: 20 },
  summaryBox: {
    flex: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sideColumn: { flex: 2, gap: 8 },
  dueBox: {
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dueLabel: {
    fontSize: 7,
    color: "#dbeafe",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dueValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  dueDate: { fontSize: 8, color: "#dbeafe", marginTop: 4 },
  infoBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  lineTotal: {
    borderTopWidth: 0.5,
    borderTopColor: "#111827",
    marginTop: 3,
    paddingTop: 5,
    fontFamily: "Helvetica-Bold",
  },
  lineMuted: { color: "#6b7280" },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
    marginBottom: 6,
  },
  colDate: { width: "14%" },
  colDesc: { width: "46%", paddingRight: 6 },
  colType: { width: "18%" },
  colAmount: { width: "22%", textAlign: "right" },
  colInstDesc: { width: "50%", paddingRight: 6 },
  colInstNo: { width: "14%" },
  colInstTotal: { width: "18%", textAlign: "right" },
  colInstAmount: { width: "18%", textAlign: "right" },
  note: { fontSize: 7, color: "#6b7280", marginTop: 14 },
});

interface CreditCardStatementPDFProps {
  statement: CreditCardStatementData;
}

const CreditCardStatementPDF = ({ statement }: CreditCardStatementPDFProps) => {
  const { card, summary, transactions, installments, payments } = statement;
  const money = (value: number) => formatCurrency(value, card.currency, "code");
  const fees =
    summary.interestCharged + summary.lateFeeCharged + summary.otherFees;

  const SummaryLine = ({
    label,
    value,
    total,
  }: {
    label: string;
    value: string;
    total?: boolean;
  }) => (
    <View style={[cc.line, total ? cc.lineTotal : {}]}>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Trackwise</Text>
            <Text style={styles.subBrand}>Credit card statement</Text>
          </View>
          <Text style={styles.generatedAt}>
            Generated on {moment().format("MMM D, YYYY h:mm A")}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Card</Text>
            <Text style={styles.metaValue}>{card.name}</Text>
            {card.institution && (
              <Text style={styles.category}>{card.institution}</Text>
            )}
          </View>
          <View>
            <Text style={styles.metaLabel}>Statement period</Text>
            <Text style={styles.metaValue}>
              {moment(statement.periodStart).format("MMM D")} –{" "}
              {moment(statement.statementDate).format("MMM D, YYYY")}
            </Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaValue}>
              {STATUS_LABELS[statement.status]}
            </Text>
          </View>
        </View>

        <View style={cc.overview}>
          <View style={cc.summaryBox}>
            <Text style={[styles.summaryLabel, { marginTop: 4 }]}>
              Account summary
            </Text>
            <SummaryLine
              label="Previous balance"
              value={money(summary.previousBalance)}
            />
            <SummaryLine
              label="Payments & credits"
              value={money(-summary.paymentsAndCredits)}
            />
            <SummaryLine
              label="Purchases & charges"
              value={money(summary.purchases)}
            />
            <SummaryLine
              label="Installments billed"
              value={money(summary.installmentsBilled)}
            />
            {summary.adjustments !== 0 && (
              <SummaryLine
                label="Adjustments*"
                value={money(summary.adjustments)}
              />
            )}
            <SummaryLine
              label="Statement balance"
              value={money(summary.statementBalance)}
              total
            />
            {summary.interestCharged > 0 && (
              <SummaryLine
                label="Interest charged"
                value={money(summary.interestCharged)}
              />
            )}
            {summary.lateFeeCharged > 0 && (
              <SummaryLine
                label="Late payment fee"
                value={money(summary.lateFeeCharged)}
              />
            )}
            {summary.otherFees > 0 && (
              <SummaryLine label="Other fees" value={money(summary.otherFees)} />
            )}
            {fees > 0 && (
              <SummaryLine
                label="Total amount due"
                value={money(summary.totalAmountDue)}
                total
              />
            )}
          </View>

          <View style={cc.sideColumn}>
            <View style={cc.dueBox}>
              <Text style={cc.dueLabel}>Total amount due</Text>
              <Text style={cc.dueValue}>{money(summary.totalAmountDue)}</Text>
              <Text style={cc.dueDate}>
                Due {moment(statement.dueDate).format("MMM D, YYYY")}
              </Text>
            </View>
            <View style={cc.infoBox}>
              <SummaryLine
                label="Paid since statement"
                value={money(summary.amountPaid)}
              />
              <SummaryLine
                label="Remaining due"
                value={money(summary.remainingDue)}
              />
            </View>
            <View style={cc.infoBox}>
              <SummaryLine
                label="Credit limit"
                value={money(summary.creditLimit)}
              />
              <SummaryLine
                label="Available credit"
                value={money(summary.availableCredit)}
              />
            </View>
          </View>
        </View>

        <Text style={cc.sectionTitle}>Transactions</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow} fixed>
            <Text style={[cc.colDate, styles.headerCell]}>Date</Text>
            <Text style={[cc.colDesc, styles.headerCell]}>Description</Text>
            <Text style={[cc.colType, styles.headerCell]}>Type</Text>
            <Text style={[cc.colAmount, styles.headerCell]}>Amount</Text>
          </View>

          {transactions.length === 0 && (
            <Text style={styles.empty}>No transactions this cycle.</Text>
          )}

          {transactions.map((tx, i) => (
            <View
              style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
              key={tx.id}
              wrap={false}
            >
              <Text style={cc.colDate}>{moment(tx.date).format("MMM D")}</Text>
              <View style={cc.colDesc}>
                <Text>{tx.description}</Text>
                {(tx.category || tx.counterpart) && (
                  <Text style={styles.category}>
                    {tx.category ?? tx.counterpart}
                  </Text>
                )}
              </View>
              <Text style={[cc.colType, cc.lineMuted]}>{tx.type}</Text>
              <Text
                style={[cc.colAmount, tx.amount < 0 ? styles.credit : {}]}
              >
                {money(tx.amount)}
              </Text>
            </View>
          ))}
        </View>

        {installments.length > 0 && (
          <>
            <Text style={cc.sectionTitle}>Installments billed</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[cc.colInstDesc, styles.headerCell]}>
                  Purchase
                </Text>
                <Text style={[cc.colInstNo, styles.headerCell]}>Term</Text>
                <Text style={[cc.colInstTotal, styles.headerCell]}>
                  Original
                </Text>
                <Text style={[cc.colInstAmount, styles.headerCell]}>
                  Billed
                </Text>
              </View>
              {installments.map((line, i) => (
                <View
                  style={[
                    styles.tableRow,
                    i % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                  key={line.planId}
                  wrap={false}
                >
                  <Text style={cc.colInstDesc}>{line.description}</Text>
                  <Text style={cc.colInstNo}>
                    {line.installmentNo} of {line.termMonths}
                  </Text>
                  <Text style={[cc.colInstTotal, cc.lineMuted]}>
                    {money(line.totalAmount)}
                  </Text>
                  <Text style={cc.colInstAmount}>{money(line.amount)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {payments.length > 0 && (
          <>
            <Text style={cc.sectionTitle}>Payments since statement</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[cc.colDate, styles.headerCell]}>Date</Text>
                <Text style={[cc.colDesc, styles.headerCell]}>
                  Description
                </Text>
                <Text style={[cc.colType, styles.headerCell]}>From</Text>
                <Text style={[cc.colAmount, styles.headerCell]}>Amount</Text>
              </View>
              {payments.map((payment, i) => (
                <View
                  style={[
                    styles.tableRow,
                    i % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                  key={payment.id}
                  wrap={false}
                >
                  <Text style={cc.colDate}>
                    {moment(payment.date).format("MMM D")}
                  </Text>
                  <Text style={cc.colDesc}>{payment.description}</Text>
                  <Text style={[cc.colType, cc.lineMuted]}>
                    {payment.from ?? "—"}
                  </Text>
                  <Text style={[cc.colAmount, styles.credit]}>
                    {money(payment.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {summary.adjustments !== 0 && (
          <Text style={cc.note}>
            * The statement balance was fixed when this cycle closed.
            Adjustments cover transactions added or changed afterwards, and any
            credit balance, which carries over instead of being billed.
          </Text>
        )}

        <View style={styles.footer} fixed>
          <Text>Generated automatically by Trackwise · {card.name}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default CreditCardStatementPDF;
