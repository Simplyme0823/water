export interface EvalCase {
  input: string;
  expected?: string;
}

export interface EvalSuite {
  name: string;
  cases: EvalCase[];
}

export interface EvalReport {
  suite: string;
  total: number;
  passed: number;
}

export class EvalRunner {
  async runSuite(suite: EvalSuite): Promise<EvalReport> {
    return { suite: suite.name, total: suite.cases.length, passed: 0 };
  }
}
