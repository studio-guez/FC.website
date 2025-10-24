<template>
    <section class="v-inscription"
    >
      <form method="post"
            action="https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/18211/submit"
            class="inf-form">
        <input type="email" name="email" style="display:none"/>
        <input type="hidden" name="key"
               value="eyJpdiI6ImRuVGpEVEpRSGFqTFNXSGFDRk5CQks4XC9PSkhSb2pxc1UxYzlLTmFvTFR3PSIsIm1hYyI6ImVhOTgzNDIxZjhhMmU3OTBiNWVhYzcwOTFkN2Y1OTU3MWNmMjZjODkzZDljZTU1MjQ3YzE3ZWU4NWVhMDljMTYiLCJ2YWx1ZSI6IllzQjZjU2hxSzJtWVo3RE9NTWpiRXhqcTBBOWZRYnRNdmpTOG5RYmFNM289In0=">
        <input type="hidden" name="webform_id" value="18211">
        <div class="inf-main_4186b8943907012bd947930996fe9051"><h4></h4> <span></span>
          <div class="inf-success" style="display:none"><h4>Votre inscription a été enregistrée avec succès !</h4>
            <p><a href="#" class="inf-btn">&laquo;</a></p></div>
          <div class="inf-content">
            <div class="inf-input inf-input-text"><input type="email" name="inf[1]" data-inf-meta="1" data-inf-error=""
                                                         required="required" placeholder="Email *"></div>
            <div class="recaptcha-container"><label
              data-mcaptcha_url="https://captcha.infomaniak.com/widget/?sitekey=wKJaAigS1e48fWgqtjvg5w7rKA6QIwmy"
              for="mcaptcha__token" id="mcaptcha__token-label"> <input type="text" name="mcaptcha__token"
                                                                       id="mcaptcha__token"/> </label>
              <div id="mcaptcha__widget-container"></div>
              <component is="script" src="https://unpkg.com/@mcaptcha/vanilla-glue@0.1.0-rc2/dist/index.js"></component>
            </div>
            <div class="inf-submit"><input type="submit" style="margin-top: 25px;" name="" value="Envoyé"></div>
          </div>
        </div>
      </form>
    </section>
</template>




<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    message?: string
}>()
</script>





<style lang="scss" scoped >
.v-inscription {
}
</style>
