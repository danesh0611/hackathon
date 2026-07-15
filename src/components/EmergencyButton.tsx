import { Phone, ShieldAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { buttonVariants } from "@/components/ui/button";

interface EmergencyButtonProps {
  className?: string;
}

export function EmergencyButton({ className }: EmergencyButtonProps) {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "destructive", size: "lg", className })}>
        <Phone className="mr-2 h-4 w-4" />
        Emergency
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            Emergency Contacts
          </DialogTitle>
          <DialogDescription>
            If you are in immediate danger or a crime is in progress, please contact the authorities right away.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <a
            href="tel:112"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-red-200 bg-red-50 p-6 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:hover:bg-red-900/50"
          >
            <Phone className="mb-2 h-8 w-8 text-red-600 dark:text-red-400" />
            <span className="text-xl font-bold text-red-700 dark:text-red-300">Call 112</span>
            <span className="text-sm font-medium text-red-600/80 dark:text-red-400/80">National Emergency Number</span>
          </a>
          
          <a
            href="tel:1930"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-amber-200 bg-amber-50 p-6 transition-colors hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/30 dark:hover:bg-amber-900/50"
          >
            <Phone className="mb-2 h-8 w-8 text-amber-600 dark:text-amber-400" />
            <span className="text-xl font-bold text-amber-700 dark:text-amber-300">Call 1930</span>
            <span className="text-sm font-medium text-amber-600/80 dark:text-amber-400/80">Cyber Crime Helpline</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
