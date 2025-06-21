"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HandHeart, Landmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const presetAmounts = [25, 50, 100, 250];

export default function NewDonationPage() {
    const [amount, setAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPreset(null);
        setAmount(e.target.value);
    };

    const handlePresetClick = (preset: number) => {
        setSelectedPreset(preset);
        setAmount(preset.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            toast({
                variant: "destructive",
                title: "Invalid Amount",
                description: "Please enter a valid positive number for the donation amount.",
            });
            return;
        }

        console.log(`Donating $${donationAmount}`);
        // Simulate payment processing
        toast({
            title: "Processing Donation...",
            description: "Thank you for your generosity!",
        });

        setTimeout(() => {
            router.push('/donors');
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Make a New Donation</CardTitle>
                    <CardDescription>Your contribution makes a world of difference. Select or enter an amount to donate.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {presetAmounts.map((preset) => (
                                <Button
                                    key={preset}
                                    type="button"
                                    variant={selectedPreset === preset ? 'default' : 'outline'}
                                    className="h-16 text-xl"
                                    onClick={() => handlePresetClick(preset)}
                                >
                                    ${preset}
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
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                            <Button variant="outline" className="w-full h-12 justify-start text-left">
                                <Landmark className="mr-4" />
                                <div className="flex flex-col">
                                    <span className="font-semibold">Connected Bank Account</span>
                                    <span className="text-muted-foreground text-xs">Checking **** 1234</span>
                                </div>
                            </Button>
                        </div>
                         <Button type="submit" size="lg" className="w-full h-14 text-lg">
                            <HandHeart className="mr-2" />
                            Donate ${amount || '0.00'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
