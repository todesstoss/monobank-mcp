export const toTextContent = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

export const toolHandler =
  <T>(fn: () => Promise<T>) =>
  async () => {
    try {
      return toTextContent(await fn());
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return {
        content: [{ type: "text" as const, text: message }],
        isError: true as const,
      };
    }
  };
