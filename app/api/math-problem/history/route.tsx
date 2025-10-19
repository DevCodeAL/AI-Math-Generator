import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_identifier');

  try {
    const { data, error } = await supabase
      .from('math_problem_submissions')
      .select('*')
      .eq('user_identifier', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ submissions: data });
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
