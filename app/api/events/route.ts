export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      const message = "Connected to SSE via GET";
      controller.enqueue(encoder.encode(`data: ${message}\n\n`));

      const intervalId = setInterval(() => {
        const timestamp = new Date().toISOString();
        const updateMessage = `GET update at ${timestamp}`;
        controller.enqueue(encoder.encode(`data: ${updateMessage}\n\n`));
      }, 3000);

      return () => {
        clearInterval(intervalId);
      };
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
      Connection: "keep-alive",
    },
  });
}
