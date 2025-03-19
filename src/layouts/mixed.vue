<template>
    <div class="layout-container">
        <div class="background-layout">
            <div class="light-left"></div>
            <div class="light-right"></div>
            <div class="light-right-small"></div>
            <div class="light-bottom"></div>
            <img src="@/assets/images/gems-left.png" class="gems-left" />
            <img src="@/assets/images/gems-right.png" class="gems-right" />
        </div>
        <div class="main-view">
            <header style="position: fixed; top: 0; width: 100%; z-index: 2;">
                <slot name="header" />
            </header>
            <main style="padding: 0; overflow: auto">
                <slot />
            </main> 
        </div>
    </div>
</template>