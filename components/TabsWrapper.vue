<template>
  <div class="tabs_wrapper">
    <div class="tabs cemter">
      <ul class="tabs__header cemter">
        <li v-for="title in tabTitles" :key="title" @click="selectedTitle = title" class="tabs__tab" :class="{selected: title == selectedTitle}">
          {{ title }}
        </li>
      </ul>
    </div>
    <slot/>
  </div>
</template>

<script> 
import { ref, provide } from 'vue';

export default {
  setup(props, { slots }) {
    const tabTitles = ref(slots.default().map((tab) => tab.props.title));
    const selectedTitle = ref(tabTitles.value[0])

    provide('selectedTitle', selectedTitle);
    return {
      selectedTitle,
      tabTitles,
    };
  },
};

</script>