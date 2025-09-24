<?php
// ZzZ:CREATE
// app/Http/Controllers/Web/RedirectController.php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RedirectController extends Controller
{
    public function redirect(string $code)
    {
        $row = DB::table('urls')->where('code', $code)->first();

        if (!$row) {
            abort(404);
        }

        return redirect()->away($row->full_url);
    }
}
