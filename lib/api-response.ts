import { NextResponse } from 'next/server';

type SuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

type ErrorResponse = {
  success: false;
  error: string;
  details?: any;
};

export function apiSuccess<T>(data: T, meta?: SuccessResponse<T>['meta'], status = 200) {
  return NextResponse.json({ success: true, data, meta }, { status });
}

export function apiError(error: string, details?: any, status = 400) {
  return NextResponse.json({ success: false, error, details }, { status });
}
