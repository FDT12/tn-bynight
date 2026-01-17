import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '../context/AuthContext';

interface SuggestEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string | null;
}

export function SuggestEventModal({ isOpen, onClose, initialCity }: SuggestEventModalProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    date: '',
    price: '',
    url: '',
    city: initialCity || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/suggest`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit suggestion');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', place: '', date: '', price: '', url: '', city: '' });
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] z-[2000] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Suggest an Event</DialogTitle>
          <DialogDescription>
            Found an event we missed? Let us know! It will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>
        {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Event Name *</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="place">Place/Venue</Label>
                <Input id="place" value={formData.place} onChange={e => setFormData({...formData, place: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="e.g. Tonight 9 PM" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 20 TND" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="url">Link (Facebook/Instagram/Ticket) *</Label>
                <Input id="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} required />
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Suggestion'}</Button>
            </DialogFooter>
            </form>
        ) : (
            <div className="py-10 text-center">
                <h3 className="text-green-600 text-xl font-bold mb-2">Thank you!</h3>
                <p>Your suggestion has been submitted for review.</p>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
