<?php
// ZzZ:CREATE
// app\Http\Middleware\CheckRoleAndStatus.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;    // ZzZ: auth

class CheckRoleAndStatus
{
    public function handle(Request $request, Closure $next, $role, $status = 'active'): Response    //ZzZ:add $role
    {
        // return $next($request);  // ZzZ:comments

        if (Auth::check()) {
            $user = Auth::user();

            if ($user->role === $role && $user->status === $status) {
                return $next($request);
            }
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized'
        ], 403);
    }
}
