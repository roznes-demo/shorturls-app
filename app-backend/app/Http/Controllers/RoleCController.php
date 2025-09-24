<?php
//ZzZ:CREATE
// app\Http\Controllers\RoleCController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RoleCController extends Controller
{
    public function dashboard(Request $request)
    {
        try {
            $data = collect([
                ['message' => 'Welcome to Role C dashboard!']
            ]);
            return $this->successResponse($data, 'Role C Dashboard Accessed');
        } catch (\Throwable $e) {
            \Log::error($e);
            return $this->errorResponse('Failed to access Role C dashboard.', $e);
        }
    }

    private function successResponse($data, $message, $statusCode = Response::HTTP_OK)
    {
        return response()->json([
            'status'  => 'success',
            'message' => $data->isNotEmpty() ? $message : 'No data found.',
            'exists'  => $data->isNotEmpty(),
            'data'    => $data,
        ], $statusCode);
    }

    private function errorResponse($message, \Throwable $exception, $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'details' => $exception->getMessage(),
        ], $statusCode);
    }
}
