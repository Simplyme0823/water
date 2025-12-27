import type { EvidencePack, RagClient } from "@tansui/types";

export class EmptyRagClient implements RagClient {
  // eslint-disable-next-line
  async retrieve(_input: { query: string }): Promise<EvidencePack> {
    return { items: [] };
  }
}
