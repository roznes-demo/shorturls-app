<?php
// ZzZ:TEST
// app/Http/Controllers/Api/ProductController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /**
     * Whitelisted columns for insert/update (no validation, flexible).
     * Matches the `products` table structure.
     */
    private array $cols = [
        'name',
        'description',
        'price',
        'quantity',
        'status',
    ];

    /**
     * Get all products (newest first).
     */
    public function index()
    {
        try {
            $rows = DB::table('products')->orderByDesc('id')->get();
            return $this->successResponse($rows, 'Products retrieved successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to retrieve products.', $e);
        }
    }

    /**
     * Store a new product (only whitelisted columns accepted).
     */
    public function store(Request $request)
    {
        try {
            $payload = $request->only($this->cols);

            $id  = DB::table('products')->insertGetId($payload);
            $row = DB::table('products')->where('id', $id)->first();

            return $this->successResponse(collect([$row]), 'Product created successfully', Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to create product.', $e);
        }
    }

    /**
     * Get a single product by ID.
     */
    public function show($id)
    {
        try {
            $row = DB::table('products')->where('id', $id)->first();
            if (!$row) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Product not found.',
                ], Response::HTTP_NOT_FOUND);
            }

            return $this->successResponse(collect([$row]), 'Product retrieved successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to retrieve product.', $e);
        }
    }

    /**
     * Update a product by ID (partial update).
     */
    public function update(Request $request, $id)
    {
        try {
            $exists = DB::table('products')->where('id', $id)->exists();
            if (!$exists) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Product not found.',
                ], Response::HTTP_NOT_FOUND);
            }

            $payload = $request->only($this->cols);
            if (!empty($payload)) {
                DB::table('products')->where('id', $id)->update($payload);
            }

            $row = DB::table('products')->where('id', $id)->first();
            return $this->successResponse(collect([$row]), 'Product updated successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to update product.', $e);
        }
    }

    /**
     * Delete a product by ID.
     */
    public function destroy($id)
    {
        try {
            $row = DB::table('products')->where('id', $id)->first();
            if (!$row) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Product not found.',
                ], Response::HTTP_NOT_FOUND);
            }

            DB::table('products')->where('id', $id)->delete();
            return $this->successResponse(collect(), 'Product deleted successfully');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to delete product.', $e);
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
