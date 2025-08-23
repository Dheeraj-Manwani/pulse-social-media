"use client";

import { Button } from "@/components/ui/button";
import {
  successToast,
  errorToast,
  infoToast,
  warningToast,
  customToast,
  defaultToast,
  promiseToast,
} from "@/lib/toast";

export default function ToastDemo() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Toast Demo</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Button
          onClick={() => successToast("Success! Your action was completed.")}
          variant="outline"
          className="text-green-600 hover:text-green-700"
        >
          Success Toast
        </Button>

        <Button
          onClick={() => errorToast("Error! Something went wrong.")}
          variant="outline"
          className="text-red-600 hover:text-red-700"
        >
          Error Toast
        </Button>

        <Button
          onClick={() => infoToast("Info: Here's some helpful information.")}
          variant="outline"
          className="text-blue-600 hover:text-blue-700"
        >
          Info Toast
        </Button>

        <Button
          onClick={() => warningToast("Warning: Please check your input.")}
          variant="outline"
          className="text-orange-600 hover:text-orange-700"
        >
          Warning Toast
        </Button>

        <Button
          onClick={() => customToast("Custom toast with sparkle! ✨")}
          variant="outline"
          className="text-purple-600 hover:text-purple-700"
        >
          Custom Toast
        </Button>

        <Button
          onClick={() => defaultToast("Default toast message.")}
          variant="outline"
        >
          Default Toast
        </Button>

        <Button
          onClick={() =>
            promiseToast(new Promise((resolve) => setTimeout(resolve, 3000)), {
              loading: "loaaaa",
              success: "succccc",
              error: "errrrr",
            })
          }
        >
          Promise Toast
        </Button>
      </div>
    </div>
  );
}
