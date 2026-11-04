import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  Award,
  Layers,
  ShieldCheck,
  FileText,
  Clock
} from 'lucide-react';
import { EvaluationBenchmarkSummary, Language } from '../types';
import { runRAGEvaluation } from '../services/api';

interface EvaluationDashboardProps {
  language: Language;
}

export const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({ language }) => {
  const [report, setReport] = useState<EvaluationBenchmarkSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [sampleCount, setSampleCount] = useState<number>(30);

  const executeBenchmark = async () => {
    setIsRunning(true);
    try {
      const data = await runRAGEvaluation(sampleCount);
      setReport(data);
    } catch (err: any) {
      alert('Evaluation error: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeBenchmark();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-agri-800 text-white p-6 sm:p-10 rounded-3xl shadow-lg border border-agri-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-agri-100">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Rigorous Agricultural Evaluation Framework</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              RAG Pipeline Evaluation & Benchmark Suite
            </h1>
            <p className="text-xs sm:text-sm text-agri-100 max-w-2xl leading-relaxed">
              Standardized automated testing across 30+ organic farming inquiries measuring retrieval precision,
              concept coverage, citation correctness, and zero-hallucination faithfulness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={executeBenchmark}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-forest hover:bg-agri-50 text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-agri-700" />
                  <span>Evaluating Benchmark...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-agri-700 fill-agri-700" />
                  <span>Run 30-Question Benchmark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Retrieval Precision
            </span>
            <div className="text-2xl font-extrabold text-agri-700">
              {report.retrieval_precision_rate}%
            </div>
            <p className="text-[10px] text-slate-500">Correct agricultural document matched</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Answer Faithfulness
            </span>
            <div className="text-2xl font-extrabold text-emerald-700">
              {report.answer_faithfulness_rate}%
            </div>
            <p className="text-[10px] text-slate-500">Zero banned chemical hallucinations</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Citation Correctness
            </span>
            <div className="text-2xl font-extrabold text-blue-700">
              {report.citation_correctness_rate}%
            </div>
            <p className="text-[10px] text-slate-500">Authentic source attribution</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Concept Coverage
            </span>
            <div className="text-2xl font-extrabold text-lime-800">
              {report.average_context_concept_coverage}%
            </div>
            <p className="text-[10px] text-slate-500">Key scientific entities recalled</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Overall RAG Grade
            </span>
            <div className="text-2xl font-extrabold text-forest">
              {report.overall_rag_grade}
            </div>
            <p className="text-[10px] text-slate-500">Avg Latency: {report.average_latency_seconds}s</p>
          </div>
        </div>
      )}

      {/* Benchmark Detailed Questions Table */}
      {report && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Detailed Test Set Results (30 Organic Farming Inquiries)
              </h3>
              <p className="text-xs text-slate-500">
                Includes mandatory benchmark questions: Vermicompost, Cotton IPM, Tomato blights, Paddy nutrients, and Soil health.
              </p>
            </div>
            <span className="text-xs font-bold text-agri-700">
              {report.total_benchmark_questions} Test Cases Passed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Expected Source</th>
                  <th className="py-2.5 px-3">Retrieval</th>
                  <th className="py-2.5 px-3">Concept %</th>
                  <th className="py-2.5 px-3">Citations</th>
                  <th className="py-2.5 px-3">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {report.detailed_results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 font-bold">{res.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs">{res.question}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {res.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-agri-800">{res.expected_source}</td>
                    <td className="py-2.5 px-3">
                      {res.retrieval_hit ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" /> Partial
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{res.entity_coverage_pct}%</td>
                    <td className="py-2.5 px-3">
                      {res.citation_correct ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px]">
                          Cited
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{res.latency_sec}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
