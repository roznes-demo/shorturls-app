<?php
// ZzZ:CREATE
// app\Http\Middleware\TokenExpirationMiddleware.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class TokenExpirationMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->bearerToken()) {
            $token = PersonalAccessToken::findToken($request->bearerToken());

            if ($token && $token->expires_at && now()->greaterThan($token->expires_at)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token has expired. Please login again.'
                ], 401);
            }
        }

        return $next($request);
    }
}
