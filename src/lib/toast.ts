import toast, { ToastOptions } from "react-hot-toast";

// Base toast styles
const toastStyles: ToastOptions = {
  duration: 4000,
  position: "top-center",
  style: {
    background: "hsl(var(--card))", // fully opaque
    color: "hsl(var(--card-foreground))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem", // rounded-xl
    padding: "12px 16px",
    fontSize: "0.875rem", // text-sm
    fontWeight: 500,
    lineHeight: 1.4,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.06)",
    maxWidth: "380px",
    minWidth: "280px",
    opacity: 1,
    animation: "toast-slide-in 0.35s ease-out",
  },
};

// Animations (injected globally once)
if (typeof window !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    @keyframes toast-slide-in {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes toast-slide-out {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-20px);
        opacity: 0;
      }
    }

    .react-hot-toast {
      animation: toast-slide-out 0.3s ease-in forwards;
    }
  `;
  document.head.appendChild(styleTag);
}

// ✅ Success
export const successToast = (message: string) =>
  toast.success(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      borderLeft: "4px solid hsl(142.1 76.2% 36.3%)",
      background: "hsl(var(--card))", // solid card background
    },
    iconTheme: {
      primary: "hsl(142.1 76.2% 36.3%)",
      secondary: "hsl(var(--card))",
    },
  });

// ❌ Error
export const errorToast = (message: string) =>
  toast.error(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      borderLeft: "4px solid hsl(0 72% 51%)",
      background: "hsl(var(--card))",
    },
    iconTheme: {
      primary: "hsl(0 72% 51%)",
      secondary: "hsl(var(--card))",
    },
  });

// 💡 Info
export const infoToast = (message: string) =>
  toast(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      borderLeft: "4px solid hsl(217.2 91.2% 59.8%)",
      background: "hsl(var(--card))",
    },
    icon: "💡",
  });

// ⚠️ Warning
export const warningToast = (message: string) =>
  toast(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      borderLeft: "4px solid hsl(38 92% 50%)",
      background: "hsl(var(--card))",
    },
    icon: "⚠️",
  });

// ✨ Custom
export const customToast = (message: string, icon?: string) =>
  toast(message, {
    ...toastStyles,
    style: {
      ...toastStyles.style,
      borderLeft: "4px solid hsl(var(--primary))",
      background: "hsl(var(--card))",
    },
    icon: icon || "✨",
  });

// 🔄 Promise-based toast
export const promiseToast = <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string },
) =>
  toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      ...toastStyles,
      style: {
        ...toastStyles.style,
        borderLeft: "4px solid hsl(var(--primary))",
        background: "hsl(var(--card))",
      },
    },
  );

// 🔹 Default
export const defaultToast = (message: string) => toast(message, toastStyles);

export { toast };
export default toast;

// import toast, { ToastOptions } from "react-hot-toast";

// // Custom toast styles that match the application theme
// const toastStyles: ToastOptions = {
//   duration: 4000,
//   position: "top-center",
//   style: {
//     background: "hsl(var(--card))",
//     color: "hsl(var(--card-foreground))",
//     border: "1px solid hsl(var(--border))",
//     borderRadius: "12px",
//     padding: "12px 16px",
//     fontSize: "14px",
//     fontWeight: "500",
//     boxShadow:
//       "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//     maxWidth: "400px",
//     minWidth: "300px",
//   },
// };

// // Success toast with green accent
// export const successToast = (message: string) => {
//   return toast.success(message, {
//     ...toastStyles,
//     style: {
//       ...toastStyles.style,
//       borderLeft: "4px solid hsl(161 94% 30%)",
//       background:
//         "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(161 94% 30% / 0.05) 100%)",
//     },
//     iconTheme: {
//       primary: "hsl(161 94% 30%)",
//       secondary: "hsl(var(--card-foreground))",
//     },
//   });
// };

// // Error toast with red accent
// export const errorToast = (message: string) => {
//   return toast.error(message, {
//     ...toastStyles,
//     style: {
//       ...toastStyles.style,
//       borderLeft: "4px solid hsl(0 72% 51%)",
//       background:
//         "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(0 72% 51% / 0.05) 100%)",
//     },
//     iconTheme: {
//       primary: "hsl(0 72% 51%)",
//       secondary: "hsl(var(--card-foreground))",
//     },
//   });
// };

// // Info toast with blue accent
// export const infoToast = (message: string) => {
//   return toast(message, {
//     ...toastStyles,
//     style: {
//       ...toastStyles.style,
//       borderLeft: "4px solid hsl(222 80% 52%)",
//       background:
//         "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(222 80% 52% / 0.05) 100%)",
//     },
//     icon: "💡",
//   });
// };

// // Warning toast with orange accent
// export const warningToast = (message: string) => {
//   return toast(message, {
//     ...toastStyles,
//     style: {
//       ...toastStyles.style,
//       borderLeft: "4px solid hsl(38 92% 50%)",
//       background:
//         "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(38 92% 50% / 0.05) 100%)",
//     },
//     icon: "⚠️",
//   });
// };

// // Custom toast with primary color accent
// export const customToast = (message: string, icon?: string) => {
//   return toast(message, {
//     ...toastStyles,
//     style: {
//       ...toastStyles.style,
//       borderLeft: "4px solid hsl(222 80% 52%)",
//       background:
//         "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(222 80% 52% / 0.05) 100%)",
//     },
//     icon: icon || "✨",
//   });
// };

// // Default toast
// export const defaultToast = (message: string) => {
//   return toast(message, toastStyles);
// };

// // Export the base toast function for custom usage
// export { toast };
// export default toast;
