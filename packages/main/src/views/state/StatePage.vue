<template>
  <div class="stateContainer">
    <div class="defence">
      <DefenceState />
    </div>
    <div class="device">
      <DeviceState />
    </div>
    <div class="pilot"><PilotLamp /></div>
  </div>
</template>
<script lang="ts" setup>
import PilotLamp from "./components/PilotLamp.vue";
import DefenceState from "./components/DefenceState.vue";
import DeviceState from "./components/DeviceState.vue";
</script>
<style lang="less" scoped>
.stateContainer {
  height: 100%;
  background-color: #0666a2;
  .pilot {
    width: 33.33%;
    height: 100%;
    float: left;
  }
  .defence {
    width: 33.33%;
    height: 100%;
    float: left;
  }
  .device {
    width: 33.33%;
    height: 100%;
    float: left;
    display: flex;
    justify-content: center;
  }
}
</style>
