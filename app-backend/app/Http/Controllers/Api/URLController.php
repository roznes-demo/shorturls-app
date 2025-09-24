<?php
// ZzZ:CREATE
// app\Http\Controllers\Api\URLController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class URLController extends Controller
{
    private array $cols = [
        'full_url',
        'code',
        'status',
    ];

    public function index()
    {
        try {
            $rows = DB::table('urls')->orderByDesc('id')->get();
            return $this->successResponse($rows, 'URLs retrieved successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to retrieve URLs.', $e);
        }
    }

    public function store(Request $request)
    {
        try {
            $payload = $request->only($this->cols);

            if (empty($payload['code'])) {
                $payload['code'] = Str::random(8);
            }

            $id  = DB::table('urls')->insertGetId($payload);
            $row = DB::table('urls')->where('id', $id)->first();

            return $this->successResponse(collect([$row]), 'URL created successfully', Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to create URL.', $e);
        }
    }

    public function show($id)
    {
        try {
            $row = DB::table('urls')->where('id', $id)->first();
            if (!$row) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'URL not found.',
                ], Response::HTTP_NOT_FOUND);
            }

            return $this->successResponse(collect([$row]), 'URL retrieved successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to retrieve URL.', $e);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $exists = DB::table('urls')->where('id', $id)->exists();
            if (!$exists) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'URL not found.',
                ], Response::HTTP_NOT_FOUND);
            }

            $payload = $request->only($this->cols);
            if (!empty($payload)) {
                DB::table('urls')->where('id', $id)->update($payload);
            }

            $row = DB::table('urls')->where('id', $id)->first();
            return $this->successResponse(collect([$row]), 'URL updated successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to update URL.', $e);
        }
    }

    public function destroy($id)
    {
        try {
            $row = DB::table('urls')->where('id', $id)->first();
            if (!$row) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'URL not found.',
                ], Response::HTTP_NOT_FOUND);
            }

            DB::table('urls')->where('id', $id)->delete();
            return $this->successResponse(collect(), 'URL deleted successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to delete URL.', $e);
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
