
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-settings";
import type { Currency, Language } from "@/types";

interface LanguageCurrencyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageCurrencyDialog({ isOpen, onOpenChange }: LanguageCurrencyDialogProps) {
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency 
  } = useSettings();

  const handleSave = () => {
    // State is saved on change, so we just close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Language and Currency</DialogTitle>
          <DialogDescription>
            Choose the language and currency you want to use on TripsandStay.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Language</h3>
            <RadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en-IN" id="lang-en-in" />
                <Label htmlFor="lang-en-in" className="flex-1 cursor-pointer">English (IN)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="es" id="lang-es" />
                <Label htmlFor="lang-es" className="flex-1 cursor-pointer">Español</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fr" id="lang-fr" />
                <Label htmlFor="lang-fr" className="flex-1 cursor-pointer">Français</Label>
              </div>
            </RadioGroup>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-4">Currency</h3>
             <RadioGroup value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INR" id="curr-inr" />
                <Label htmlFor="curr-inr" className="flex-1 cursor-pointer">Indian Rupee (₹)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="curr-usd" />
                <Label htmlFor="curr-usd" className="flex-1 cursor-pointer">US Dollar ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EUR" id="curr-eur" />
                <Label htmlFor="curr-eur" className="flex-1 cursor-pointer">Euro (€)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
