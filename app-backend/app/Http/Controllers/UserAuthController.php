<?php
// ZzZ:CREATE
// app\Http\Controllers\UserAuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string',
            'email'    => 'required|string|email',
            'password' => 'required|min:8',
            'role'     => 'nullable|in:0,1,2', // ZzZ | 0:A, 1:B, 2:C
        ], [
            'password.min' => 'Password must be at least 8 characters long.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $existingUser = User::where('email', $request->email)->exists();
        if ($existingUser) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email already exists'
            ], 409);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password), 
            'role'     => $request->input('role', '0'), // ZzZ | default role '0' (A)
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User Created'
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Credentials'
            ], 401);
        }

        // $expiration = now()->addMonth();
        // $expiration = now()->addDay();
        $expiration = now()->addHours(24);
        // $expiration = now()->addMinutes(1);
        // $expiration = now()->addSeconds(30);

        $token = $user->createToken($user->name . '-AuthToken')->plainTextToken;

        $user->tokens()->latest()->first()->update([
            'expires_at' => $expiration
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'access_token' => $token,
            'expires_at' => $expiration
        ]);
    }

    public function logout(){
        auth()->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            "message"=>"logged out"
        ]);
    }
}
