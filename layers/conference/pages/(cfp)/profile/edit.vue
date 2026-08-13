<script setup lang="ts">
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();
definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });
useSeoMeta({ title: "Edit Profile" });
</script>

<template>
  <div>
    <CfpSharedBreadcrumb
      :crumbs="[
        { label: 'My Profile', href: '/profile' },
        { label: 'Edit Profile' },
      ]"
    />

    <!-- Page header -->
    <div class="mx-auto max-w-3xl px-6 py-10 md:py-12">
      <div class="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5">
        <h1 class="mb-6 font-lora text-2xl font-bold text-cfp-olive md:text-3xl">
          Edit Profile
        </h1>

        <div class="flex flex-wrap items-center gap-5">
          <NuxtLink
            to="/my-papers"
            class="font-poppins text-sm font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-cfp-olive"
          >
            My Papers
          </NuxtLink>
          <NuxtLink
            :to="hasSubmittedPaper ? `/submit-paper/${submittedPaperId}` : '/submit-paper/draft'"
            class="rounded-full bg-cfp-red px-6 py-2.5 font-lora text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {{ hasSubmittedPaper ? 'Edit Your Paper' : 'Submit a Paper' }}
          </NuxtLink>
        </div>
      </div>

      <ProfileEditForm />
    </div>
  </div>
</template>
