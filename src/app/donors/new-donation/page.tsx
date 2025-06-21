"use client"

import React, { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { HandHeart, Landmark, UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAllRecipients } from '@/lib/data';
import type { User } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { createDonation } from '@/app/actions';

const presetAmounts = [2000, 5000, 10000, 25000];

function SubmitButton({ amount }: { amount: string }) {
    const { pending } = useFormStatus();
    const donationAmount = parseFloat(amount) || 0;

    return (
        <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={pending || donationAmount <= 0}>
            <HandHeart className="mr-2" />
            {pending ? 'Processing...' : `Donate Rs. ${donationAmount.toFixed(2)}`}
        </Button>
    );
}


export default function NewDonationPage() {
    const [amount, setAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const [purpose, setPurpose] = useState('');
    const [recipients, setRecipients] = useState<User[]>([]);
    const [selectedRecipient, setSelectedRecipient] = useState<string>('');
    const [isNewRecipientDialogOpen, setIsNewRecipientDialogOpen] = useState(false);
    const [newRecipientName, setNewRecipientName] = useState('');
    
    const { toast } = useToast();

    useEffect(() => {
        setRecipients(getAllRecipients());
    }, []);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPreset(null);
        setAmount(e.target.value);
    };

    const handlePresetClick = (preset: number) => {
        setSelectedPreset(preset);
        setAmount(preset.toString());
    };

    const handleAddNewRecipient = () => {
        if (!newRecipientName.trim()) {
            toast({
                variant: "destructive",
                title: "Invalid Name",
                description: "Recipient name cannot be empty.",
            });
            return;
        }
        setSelectedRecipient(''); 
        setIsNewRecipientDialogOpen(false);
        toast({
            title: "New Recipient Set",
            description: `${newRecipientName} will be added upon donation.`,
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Make a New Donation</CardTitle>
                    <CardDescription>Your contribution makes a world of difference.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createDonation} className="space-y-6">
                        
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient</Label>
                            <div className="flex gap-2">
                                <Select 
                                    name="recipientId"
                                    onValueChange={(value) => {
                                        setSelectedRecipient(value);
                                        setNewRecipientName('');
                                    }} 
                                    value={selectedRecipient}
                                    disabled={!!newRecipientName}
                                >
                                    <SelectTrigger id="recipient" className="h-12">
                                        <Users className="mr-2" />
                                        <SelectValue placeholder="Select a recipient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recipients.map((recipient) => (
                                            <SelectItem key={recipient.id} value={recipient.id}>
                                                {recipient.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Dialog open={isNewRecipientDialogOpen} onOpenChange={setIsNewRecipientDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline" size="icon" className="h-12 w-12 flex-shrink-0">
                                            <UserPlus />
                                            <span className="sr-only">Add New Recipient</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Recipient</DialogTitle>
                                            <DialogDescription>
                                                Enter the name of the new recipient you'd like to donate to.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="new-recipient-name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="new-recipient-name"
                                                    value={newRecipientName}
                                                    onChange={(e) => setNewRecipientName(e.target.value)}
                                                    className="col-span-3"
                                                    placeholder="e.g., Hope Foundation"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" onClick={handleAddNewRecipient}>Add Recipient</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <input type="hidden" name="newRecipientName" value={newRecipientName} />
                             {newRecipientName && !selectedRecipient && (
                                <p className="text-sm text-muted-foreground p-2 bg-secondary rounded-md">
                                    New recipient: <strong>{newRecipientName}</strong>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                             <Label>Amount</Label>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {presetAmounts.map((preset) => (
                                    <Button
                                        key={preset}
                                        type="button"
                                        variant={selectedPreset === preset ? 'default' : 'outline'}
                                        className="h-16 text-xl"
                                        onClick={() => handlePresetClick(preset)}
                                    >
                                        Rs. {preset}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    placeholder="Or enter a custom amount"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="h-12 text-lg"
                                    min="1"
                                    step="0.01"
                                />
                            </div>
                            <input type="hidden" name="amount" value={amount} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="purpose">Purpose of Donation</Label>
                            <Textarea
                                id="purpose"
                                name="purpose"
                                placeholder="e.g., To fund meals for the homeless, for school supplies..."
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="min-h-[100px]"
                                required
                            />
                        </div>


                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                            <Button variant="outline" className="w-full h-12 justify-start text-left" disabled>
                                <Landmark className="mr-4" />
                                <div className="flex flex-col">
                                    <span className="font-semibold">Connected Bank Account</span>
                                    <span className="text-muted-foreground text-xs">Checking **** 1234</span>
                                </div>
                            </Button>
                        </div>
                         <SubmitButton amount={amount} />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
