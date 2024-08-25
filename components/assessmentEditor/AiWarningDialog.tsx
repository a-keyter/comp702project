import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AIWarningDialogProps {
  open: boolean;
  onClose: () => void;
}

const AIWarningDialog: React.FC<AIWarningDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI-Generated Content Warning</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          AI-generated content may not be accurate. Always check that AI-generated content is factually correct before setting as an assessment.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Understood</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIWarningDialog;