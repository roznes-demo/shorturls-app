<?php
// ZzZ:CREATE
// app/Http/Controllers/Api/ShortURLController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ShortURLController extends Controller
{
    private array $cols = [
        'full_url',
        'code',
        'status',
    ];

    public function store(Request $request)
    {
        try {
            $payload = $request->only($this->cols);

            if (empty($payload['code'])) {
                $payload['code'] = Str::random(8);
            }

            $id  = DB::table('urls')->insertGetId($payload);
            $row = DB::table('urls')->where('id', $id)->first();

            return $this->successResponse(
                collect([$row]),
                'Short URL created successfully',
                Response::HTTP_CREATED
            );
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to create short URL.', $e);
        }
    }

    public function show(Request $request)
    {
        try {
            $code = $request->input('code');

            if (empty($code)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'code is required.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Use .env URL_BACKEND or config app.url
            $baseUrl  = rtrim(env('URL_BACKEND', config('app.url')), '/');
            $shortUrl = $baseUrl . '/short-url/' . $code;

            $data = collect([[
                'code'      => $code,
                'short_url' => $shortUrl,
            ]]);

            return $this->successResponse(
                $data,
                'Short URL generated successfully'
            );
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to generate short URL.', $e);
        }
    }

    public function checkExistFullURL(Request $request)
    {
        try {
            $fullUrl = $request->input('full_url');

            if (empty($fullUrl)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'full_url is required.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $row = DB::table('urls')
                ->where('full_url', $fullUrl)
                ->orderByDesc('id')
                ->first();

            $baseUrl = rtrim(env('URL_BACKEND', config('app.url')), '/');

            $data = $row
                ? collect([[
                    'id'        => $row->id,
                    'full_url'  => $row->full_url,
                    'code'      => $row->code,
                    'short_url' => $baseUrl . '/short-url/' . $row->code,
                    'status'    => $row->status,
                    'created_at'=> $row->created_at,
                    'updated_at'=> $row->updated_at,
                ]])
                : collect([]);

            return $this->successResponse(
                $data,
                $row ? 'URL already exists.' : 'URL not found.'
            );
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to check URL.', $e);
        }
    }

    /**
     * Success response format
     */
    private function successResponse($data, $message, $statusCode = Response::HTTP_OK)
    {
        $data = collect($data); // ensure collection

        return response()->json([
            'status'  => 'success',
            'message' => $data->isNotEmpty() ? $message : 'No data found.',
            'exists'  => $data->isNotEmpty(),
            'data'    => $data,
        ], $statusCode);
    }

    /**
     * Error response format
     */
    private function errorResponse($message, \Throwable $exception, $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'details' => $exception->getMessage(),
        ], $statusCode);
    }
}
