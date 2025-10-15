import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSearchParams } from 'react-router-dom';

export function useEmailConfirmation() {
  const [searchParams] = useSearchParams();
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if email was confirmed via URL param
    if (searchParams.get('confirmed') === 'true') {
      setEmailConfirmed(true);
    }
  }, [searchParams]);

  const sendConfirmationEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding?confirmed=true`,
          shouldCreateUser: true
        }
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailToken = async (token: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) throw error;

      setEmailConfirmed(true);
      return { success: true };
    } catch (error) {
      console.error('Error verifying email token:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emailConfirmed,
    isLoading,
    sendConfirmationEmail,
    verifyEmailToken
  };
}