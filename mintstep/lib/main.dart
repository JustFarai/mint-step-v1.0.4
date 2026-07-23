import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mintstep/app.dart';
import 'package:mintstep/core/error/failures.dart';

void main() async {
  // Ensure Flutter binding is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Run app inside a Zone to catch all uncaught asynchronous errors (scalability & crash reporting)
  runZonedGuarded(() async {
    // 1. Initialize Local Database (Hive) for offline-first caching
    await Hive.initFlutter();
    await Hive.openBox('steps_box');
    await Hive.openBox('settings_box');

    // 2. Setup Crashlytics / logging in production
    FlutterError.onError = (FlutterErrorDetails details) {
      // In production, send to Crashlytics
      debugPrint('Uncaught Flutter Error: ${details.exceptionAsString()}');
    };

    runApp(
      const ProviderScope(
        child: MintStepApp(),
      ),
    );
  }, (error, stackTrace) {
    // Catch asynchronous boundary errors
    debugPrint('Uncaught Asynchronous Error: $error');
    // In production, report to Firebase Crashlytics or Sentry
  });
}
