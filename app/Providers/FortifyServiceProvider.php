<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
        $this->configureLoginResponse();
        $this->configureRegisterResponse();
    }

    private function configureLoginResponse(): void
    {
        $this->app->singleton(LoginResponse::class, function () {
            return new class implements LoginResponse
            {
                public function toResponse($request)
                {
                    $user = $request->user();

                    $callbackUrl = (string) ($request->input('callbackUrl') ?? $request->query('callbackUrl'));
                    if ($callbackUrl !== '') {
                        $parsed = parse_url($callbackUrl);
                        if (! isset($parsed['scheme']) && Str::startsWith($callbackUrl, '/')) {
                            return redirect($callbackUrl);
                        }
                        $appUrl = (string) config('app.url');
                        $appHost = parse_url($appUrl, PHP_URL_HOST);
                        $cbHost = $parsed['host'] ?? null;
                        if ($cbHost && $appHost && $cbHost === $appHost) {
                            return redirect($callbackUrl);
                        }
                    }

                    if ($user->hasRole('admin')) {
                        return redirect()->intended('/admin/dashboard');
                    } elseif ($user->hasRole('staff')) {
                        return redirect()->intended('/staff/dashboard');
                    }

                    return redirect()->intended('/');
                }
            };
        });
    }

    private function configureRegisterResponse(): void
    {
        $this->app->singleton(RegisterResponse::class, function () {
            return new class implements RegisterResponse
            {
                public function toResponse($request)
                {
                    $user = $request->user();

                    $callbackUrl = (string) ($request->input('callbackUrl') ?? $request->query('callbackUrl'));
                    if ($callbackUrl !== '') {
                        $parsed = parse_url($callbackUrl);
                        if (! isset($parsed['scheme']) && Str::startsWith($callbackUrl, '/')) {
                            return redirect($callbackUrl);
                        }
                        $appUrl = (string) config('app.url');
                        $appHost = parse_url($appUrl, PHP_URL_HOST);
                        $cbHost = $parsed['host'] ?? null;
                        if ($cbHost && $appHost && $cbHost === $appHost) {
                            return redirect($callbackUrl);
                        }
                    }

                    if ($user->hasRole('admin')) {
                        return redirect()->intended('/admin/dashboard');
                    } elseif ($user->hasRole('staff')) {
                        return redirect()->intended('/staff/dashboard');
                    }

                    return redirect()->intended('/');
                }
            };
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
            'callbackUrl' => $request->query('callbackUrl'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn (Request $request) => Inertia::render('auth/register', [
            'callbackUrl' => $request->query('callbackUrl'),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
