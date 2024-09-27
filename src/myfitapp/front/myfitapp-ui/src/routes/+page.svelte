<script>
  import Navbar from "$lib/Navbar.svelte";
  import WorkoutSelector from "$lib/WorkoutSelector.svelte";
  import Timer from "$lib/Timer.svelte";
</script>

<svelte:head>
  <title>myFitnessAPP</title>
  <link rel="icon" href="/muscle.png" type="image/png" />
  <meta
    name="description"
    content="Web-app to help you track your training sessions"
  />
  <meta
    name="keywords"
    content="training app, workout, exercises, fitness, gym"
  />
  <!-- PWA & iOS Home Screen -->
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#007bff" />
  <!-- Adjust the theme color -->
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="mobile-web-app-title" content="myFitnessAPP" />
  <link rel="touch-icon" href="/muscle.png" />
</svelte:head>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
  <div class="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col space-y-6">
      <Navbar />
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <Timer />
      </div>
      <WorkoutSelector />
    </div>
  </div>
</div>
