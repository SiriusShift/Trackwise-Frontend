import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Construction } from "lucide-react";

const UnderDevelopment = () => (
  <CardContent className="relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-border/50 text-center h-full">
    {/* Background */}
    <div className="absolute inset-0 opacity-20 animate-[moveBg_6s_linear_infinite]">
      <div
        className="absolute inset-0 blur-[2px]"
        style={{
          backgroundImage: `
          repeating-linear-gradient(
            135deg,
            rgba(252, 255, 0, 0.15) 0px,
            rgba(252, 255, 0, 0.15) 12px,
            transparent 12px,
            transparent 24px
          )
        `,
        }}
      />
    </div>

    {/* Icon */}
    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-xs">
      <Construction className="w-5 h-5 text-yellow-500" />
    </div>

    {/* Text */}
    <div className="space-y-1">
      <p className="text-sm font-semibold tracking-tight">Under development</p>
      <p className="text-xs text-muted-foreground">
        This feature is coming soon
      </p>
    </div>
  </CardContent>
);

const LoanWidget = () => {
  return (
    <Card
      className="relative overflow-hidden border border-border/60 bg-card
        p-5 flex flex-col rounded-2xl shadow-xs col-span-full md:col-span-2 lg:col-span-2 xl:col-span-1
        transition-shadow hover:shadow-md"
    >
      <Tabs defaultValue="owe" className="flex flex-col gap-4 h-full">
        <CardHeader className="space-y-0 p-0">
          <div className="flex flex-row justify-between items-center gap-2">
            <CardTitle className="uppercase font-semibold text-xs text-foreground tracking-widest">
              Loans
            </CardTitle>
            <TabsList className="h-8">
              <TabsTrigger value="owe" className="text-xs px-2.5 py-1">
                You owe
              </TabsTrigger>
              <TabsTrigger value="owed" className="text-xs px-2.5 py-1">
                Owed to you
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

        <TabsContent
          value="owe"
          className="mt-0 flex-1 data-[state=inactive]:hidden"
        >
          <UnderDevelopment />
        </TabsContent>
        <TabsContent
          value="owed"
          className="mt-0 flex-1 data-[state=inactive]:hidden"
        >
          <UnderDevelopment />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoanWidget;
