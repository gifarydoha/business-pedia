<template>
  <div
    class="flex flex-col items-start justify-between gap-6 rounded-2xl bg-cfp-olive p-8 shadow-lg md:flex-row md:items-center md:p-10"
  >
    <div>
      <h3 class="mb-2 font-lora text-2xl font-bold text-white">
        Ready to submit your paper?
      </h3>
      <p class="font-poppins text-sm text-white/70">
        Deadline: <span class="font-semibold text-cfp-yellow">31 January 2024</span> · Bangladesh Standard Time
      </p>
    </div>
    <div class="flex shrink-0 flex-wrap gap-4">
      <NuxtLink
        to="/submit-paper"
        class="rounded-full bg-cfp-red px-8 py-3 font-lora font-bold text-white transition-opacity hover:opacity-90"
      >
        Submit Your Paper
      </NuxtLink>
      <NuxtLink
        to="/read-full-cfp"
        class="rounded-full border-2 border-white px-8 py-3 font-lora font-bold text-white transition-colors hover:bg-white/10"
      >
        Read Full CFP
      </NuxtLink>
    </div>
  </div>
</template>
