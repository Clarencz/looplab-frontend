import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api/client";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["Student", "Educator", "Researcher", "Professional", "Other"]),
    expectations: z.string().optional(),
});

interface WaitlistModalProps {
    children: React.ReactNode;
}

export const WaitlistModal = ({ children }: WaitlistModalProps) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            await api.waitlist.join(values);
            toast.success("Welcome aboard!", {
                description: "You've been added to the waitlist. We'll be in touch soon!",
            });
            setOpen(false);
            form.reset();
        } catch (error: any) {
            toast.error("Something went wrong", {
                description: error.message || "Failed to join the waitlist. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-premium border-white/10">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Join the Waitlist</DialogTitle>
                    </div>
                    <DialogDescription className="text-zinc-400">
                        Be the first to know when we launch and get early access to our premium features.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jane Doe" {...field} className="bg-white/5 border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="jane@example.com" type="email" {...field} className="bg-white/5 border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>I am a...</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10">
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="glass-premium border-white/10">
                                            <SelectItem value="Student">Student</SelectItem>
                                            <SelectItem value="Educator">Educator</SelectItem>
                                            <SelectItem value="Researcher">Researcher</SelectItem>
                                            <SelectItem value="Professional">Professional</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expectations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What do you expect the platform to have?</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. Real-time collaboration, AI tutoring for specific math topics..."
                                            className="bg-white/5 border-white/10 min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-6 h-12 text-base font-semibold" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                "Save my spot"
                            )}
                        </Button>
                        <p className="text-[10px] text-center text-zinc-500 pt-2">
                            By joining, you agree to receive occasional updates. No spam, ever.
                        </p>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
