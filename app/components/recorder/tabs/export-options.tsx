"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExportFormats } from "./export-formats";
import { BatchExport } from "../export/batch-export";

export const ExportOptions = () => {
  return (
    <Tabs defaultValue="format">
      <TabsList className="grid grid-cols-2 gap-4 mb-4">
        <TabsTrigger value="format">Format</TabsTrigger>
        <TabsTrigger value="batch">Batch</TabsTrigger>
      </TabsList>

      <TabsContent value="format">
        <ExportFormats />
      </TabsContent>

      <TabsContent value="batch">
        <BatchExport />
      </TabsContent>
    </Tabs>
  );
};