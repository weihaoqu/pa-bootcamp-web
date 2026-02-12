"use client";

import { useState } from "react";
import {
  Panel,
  Group,
  Separator,
} from "react-resizable-panels";
import { FileEntry } from "@/lib/types";
import FileTree from "./FileTree";
import CodeEditorPanel from "./CodeEditorPanel";
import InstructionsPanel from "./InstructionsPanel";

interface WorkspaceLayoutProps {
  files: FileEntry[];
  testFiles?: FileEntry[];
  instructions: string;
  title: string;
  exercisePath?: string;
  hints?: string[];
}

export default function WorkspaceLayout({
  files,
  testFiles = [],
  instructions,
  title,
  exercisePath,
  hints,
}: WorkspaceLayoutProps) {
  const allFiles = [...files, ...testFiles];
  const [activeFile, setActiveFile] = useState<string | null>(
    files.length > 0 ? files[0].path : null
  );
  const [activeTab, setActiveTab] = useState<"instructions" | "code">(
    "instructions"
  );

  return (
    <div className="h-[calc(100vh-56px-24px)]">
      {/* Mobile tab switcher */}
      <div className="flex border-b border-slate-200 bg-white md:hidden">
        <button
          onClick={() => setActiveTab("instructions")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "instructions"
              ? "border-b-2 border-accent-red text-accent-red"
              : "text-slate-500"
          }`}
        >
          Instructions
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "code"
              ? "border-b-2 border-accent-red text-accent-red"
              : "text-slate-500"
          }`}
        >
          Code
        </button>
      </div>

      {/* Desktop: resizable split panes */}
      <div className="hidden h-full md:block">
        <Group orientation="horizontal">
          {/* Instructions panel */}
          <Panel defaultSize={40} minSize={25}>
            <InstructionsPanel
              content={instructions}
              title={title}
              exercisePath={exercisePath}
              hints={hints}
            />
          </Panel>

          <Separator className="w-1.5 bg-slate-100 transition-colors hover:bg-accent-red/20" />

          {/* Code panel: file tree + editor */}
          <Panel defaultSize={60} minSize={30}>
            <Group orientation="horizontal">
              {/* File tree sidebar */}
              <Panel defaultSize={25} minSize={15} maxSize={40}>
                <div className="h-full overflow-y-auto border-r border-slate-200 bg-white p-3">
                  {files.length > 0 && (
                    <FileTree
                      files={files}
                      activeFile={activeFile}
                      onSelect={setActiveFile}
                      label="Starter Files"
                    />
                  )}
                  {testFiles.length > 0 && (
                    <div className="mt-4">
                      <FileTree
                        files={testFiles}
                        activeFile={activeFile}
                        onSelect={setActiveFile}
                        label="Test Files"
                      />
                    </div>
                  )}
                </div>
              </Panel>

              <Separator className="w-1 bg-slate-100 transition-colors hover:bg-accent-red/20" />

              {/* Code editor */}
              <Panel defaultSize={75} minSize={40}>
                <CodeEditorPanel
                  files={allFiles}
                  activeFilePath={activeFile}
                />
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>

      {/* Mobile: single panel view */}
      <div className="h-[calc(100%-41px)] md:hidden">
        {activeTab === "instructions" ? (
          <InstructionsPanel
            content={instructions}
            title={title}
            exercisePath={exercisePath}
            hints={hints}
          />
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 bg-white p-2">
              <FileTree
                files={allFiles}
                activeFile={activeFile}
                onSelect={setActiveFile}
              />
            </div>
            <div className="flex-1">
              <CodeEditorPanel
                files={allFiles}
                activeFilePath={activeFile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
