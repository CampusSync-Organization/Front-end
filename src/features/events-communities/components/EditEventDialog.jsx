import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Save } from "lucide-react";

export default function EditEventDialog({ event, open, onOpenChange, onSave }) {
  const [form, setForm] = useState({
    name: event.title ?? event.name ?? "",
    description: event.description ?? "",
    date: event.eventDate ? new Date(event.eventDate) : undefined,
    time: event.eventTime ?? event.time ?? "",
    place: event.location ?? event.place ?? "",
    capacity: event.maxParticipants ? String(event.maxParticipants) : "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Event name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.date) e.date = "Date is required";
    if (!form.time.trim()) e.time = "Time is required";
    if (!form.place.trim()) e.place = "Place is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSaving(true);
    try {
      await onSave({
        ...form,
        date: form.date instanceof Date ? form.date.toISOString().split("T")[0] : form.date,
        capacity: form.capacity ? Number(form.capacity) : null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Edit Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="e-name">Event Name <span className="text-red-500">*</span></Label>
            <Input
              id="e-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={`h-11 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="e-desc">Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="e-desc"
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start h-11 ${errors.date ? "border-red-500" : ""}`}
                  >
                    {formatDate(form.date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={form.date}
                    onSelect={(d) => set("date", d)}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="e-time">Time <span className="text-red-500">*</span></Label>
              <Input
                id="e-time"
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                className={`h-11 ${errors.time ? "border-red-500" : ""}`}
              />
              {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="e-place">Place <span className="text-red-500">*</span></Label>
            <Input
              id="e-place"
              value={form.place}
              onChange={(e) => set("place", e.target.value)}
              className={`h-11 ${errors.place ? "border-red-500" : ""}`}
            />
            {errors.place && <p className="text-sm text-red-500">{errors.place}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="e-cap">Capacity</Label>
            <Input
              id="e-cap"
              type="number"
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-11 px-6">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="h-11 px-6 bg-primary hover:bg-primary/90 text-white">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
