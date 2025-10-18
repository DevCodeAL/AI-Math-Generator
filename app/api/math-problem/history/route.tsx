import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('math_problem_submissions')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ submissions: data });
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
