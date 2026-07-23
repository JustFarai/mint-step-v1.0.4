# MintStep Flutter Project Scaffold

A production-ready, enterprise-grade, highly scalable step-tracking and wellness application built using **Flutter (latest stable)** and **Clean Architecture**.

Designed to easily scale to support millions of concurrent active users through an offline-first repository pattern, highly efficient Riverpod state-management, and lazily synchronized Firebase Firestore backend services.

## Architecture Design

MintStep adheres strictly to Uncle Bob's **Clean Architecture** combined with a **Feature-First** structure.

```
lib/
 ├── main.dart               # App initialization entry point
 ├── app.dart                # MaterialApp & global themes/localization setups
 ├── core/                   # Shared architectural components across features
 │    ├── theme/             # Material 3 Design themes (light/dark)
 │    ├── navigation/        # GoRouter setups and path rules
 │    ├── error/             # Standardized Failure and exceptions mapping
 │    └── usecases/          # Base interface definition for execution units
 └── features/               # Self-contained domain-driven feature folders
      └── steps/             # Step Tracking Feature
           ├── domain/       # Core business rules (Platform-independent)
           │    ├── entities/     # Plain Dart Objects (StepCount)
           │    ├── repositories/ # Repository Contracts
           │    └── usecases/     # GetDailySteps & SyncSteps Execution Units
           ├── data/         # Implementations & Data handling details
           │    ├── models/       # Data serialization extensions (JSON/Hive maps)
           │    ├── datasources/  # Local (Hive) and Remote (Firestore API) Clients
           │    └── repositories/ # Repository Implementations coordinating cache/remote
           └── presentation/ # UI Component and State Management Layers
                ├── providers/    # Riverpod Notifiers & Dependency Injection config
                ├── screens/      # Full views (StepsDashboardScreen)
                └── widgets/      # Isolated stateless/stateful elements
```

### Why this scales to Millions of Users:

1. **Offline-First Synchronization (Minimize API Overhead)**:
   - Data is stored instantly to local persistent caches (**Hive**) which have extremely high throughput (50,000+ operations/sec) and zero memory leak.
   - Saves are queued locally and uploaded to the cloud asynchronously. This prevents API rate limits from crashing the app during peak load and saves substantial cloud hosting expenses.

2. **Clean Separation of Concerns**:
   - The **Domain** layer does not import any UI framework (Flutter) or concrete database dependencies (Firebase, Dio, Hive). This guarantees full testability and means we can completely swap our database engine or UI framework without touching a single core business rule.

3. **Riverpod for Robust State Management**:
   - Explicit dependency injection via standard Riverpod providers ensures lazy initialization and complete control over component lifecycles.
   - States are highly reactive and avoid unnecessary widget rebuilds.

4. **Robust Error Boundaries**:
   - App bootstrap is wrapped within a safe `runZonedGuarded` block to capture any asynchronous uncaught exceptions and direct them to Crash reporting pipelines.

## Getting Started

1. Ensure you have the Flutter SDK installed (`>=3.20.0`).
2. Run `flutter pub get` in this directory to install dependencies.
3. To generate Riverpod annotators or serialization codes (if added):
   `flutter pub run build_runner build --delete-conflicting-outputs`
4. Run tests:
   `flutter test`
5. Launch App:
   `flutter run`
