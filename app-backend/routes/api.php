<?php
// ZzZ:UPDATE
// routes\api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\RoleAController;
use App\Http\Controllers\RoleBController;
use App\Http\Controllers\RoleCController;

// use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\URLController;


use App\Http\Controllers\Api\ShortURLController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ZzZ:comments
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// ##########################################PUBLIC_ROUTE.START##########################################
// user auth
Route::post('register', [UserAuthController::class, 'register']);
Route::post('login', [UserAuthController::class, 'login']);

// CRUD: products
// Route::prefix('role/user/products')->group(function () {
//     Route::get('/', [ProductController::class, 'index']);
//     Route::post('/', [ProductController::class, 'store']);
//     Route::get('/{id}', [ProductController::class, 'show']);
//     Route::put('/{id}', [ProductController::class, 'update']);
//     Route::delete('/{id}', [ProductController::class, 'destroy']);
// });

// CRUD: urls
// Route::prefix('role/user/urls')->group(function () {
//     Route::get('/', [URLController::class, 'index']);
//     Route::post('/', [URLController::class, 'store']);
//     Route::get('/{id}', [URLController::class, 'show']);
//     Route::put('/{id}', [URLController::class, 'update']);
//     Route::delete('/{id}', [URLController::class, 'destroy']);
// });

// short URLs
Route::prefix('role/user/urls')->group(function () {
    Route::post('store-full-url', [ShortURLController::class, 'store']);
    Route::post('get-short-url-by-code', [ShortURLController::class, 'show']);
    Route::post('check-exist-full-url-by-full-url', [ShortURLController::class, 'checkExistFullURL']);
});
// ##########################################PUBLIC_ROUTE.END##########################################

// ##########################################PRIVATE_ROUTE.START##########################################
Route::middleware(['auth:sanctum', 'token.expiration'])->group(function () {

    // Logout + get current user
    Route::post('logout', [UserAuthController::class, 'logout']);
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    // // role A
    // Route::middleware(['role_status:0'])->group(function () {
    //     Route::post('role-a/dashboard', [RoleAController::class, 'dashboard']);
    // });

    // // role B
    // Route::middleware(['role_status:1'])->group(function () {
    //     Route::post('role-b/dashboard', [RoleBController::class, 'dashboard']);
    // });

    // // role C
    // Route::middleware(['role_status:2'])->group(function () {
    //     Route::post('role-c/dashboard', [RoleCController::class, 'dashboard']);
    // });

    // CRUD: products
    // Route::prefix('role/admin/products')->group(function () {
    //     Route::get('/', [ProductController::class, 'index']);
    //     Route::post('/', [ProductController::class, 'store']);
    //     Route::get('/{id}', [ProductController::class, 'show']);
    //     Route::put('/{id}', [ProductController::class, 'update']);
    //     Route::delete('/{id}', [ProductController::class, 'destroy']);
    // });

    // CRUD: urls
    Route::prefix('role/admin/urls')->group(function () {
        Route::get('/', [URLController::class, 'index']);
        Route::post('/', [URLController::class, 'store']);
        Route::get('/{id}', [URLController::class, 'show']);
        Route::put('/{id}', [URLController::class, 'update']);
        // Route::delete('/{id}', [URLController::class, 'destroy']);
    });

    // short URLs
    // Route::prefix('role/admin/urls')->group(function () {
    //     Route::post('store-full-url', [ShortURLController::class, 'store']);
    //     Route::post('get-short-url-by-code', [ShortURLController::class, 'show']);
    //     Route::post('check-exist-full-url-by-full-url', [ShortURLController::class, 'checkExistFullURL']);
    // });

});
// ##########################################PRIVATE_ROUTE.END##########################################