-- Diagnostic queries 
SELECT 'RLS Status' as check_type, tablename, rowsecurity FROM pg_tables WHERE tablename = 'chat_messages'; 
SELECT 'Policies Count' as check_type, COUNT(*)::text as value FROM pg_policies WHERE tablename = 'chat_messages'; 
SELECT 'Messages Count' as check_type, COUNT(*)::text as value FROM chat_messages WHERE conversation_id = '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3'; 
SELECT 'Latest Message' as check_type, content, created_at::text FROM chat_messages WHERE conversation_id = '1e1748f0-2ad0-4cf2-8ee9-974e52046bb3' ORDER BY created_at DESC LIMIT 1; 
