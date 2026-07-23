import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mintstep/core/navigation/app_router.dart';
import 'package:mintstep/core/theme/app_theme.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class MintStepApp extends ConsumerWidget {
  const MintStepApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: 'MintStep',
      debugShowCheckedModeBanner: false,
      
      // Themes
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,

      // Routing
      routerConfig: router,

      // Localization
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''), // English
        Locale('es', ''), // Spanish
      ],
    );
  }
}

// Global state provider for ThemeMode
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);
