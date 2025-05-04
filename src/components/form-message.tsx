import { Message } from "../types/message";

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="text-primary border-l-2 border-primary px-4">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-destructive border-l-2 border-destructive px-4">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 border-muted px-4">{message.message}</div>
      )}
    </div>
  );
}
