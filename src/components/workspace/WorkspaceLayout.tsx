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
            {allFiles.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center bg-slate-50 p-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-navy">No code files</h3>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  This exercise focuses on reading and discussion — follow the instructions on the left.
                </p>
              </div>
            ) : (
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
            )}
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
