import{c,ab as o}from"./index-tcW6X9sy.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=c("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);function m(){const{track:e}=o();return{trackContactFormSubmission:(t="contact")=>{e("Lead",{contents:[{content_type:"service",content_name:t==="contact"?"Contact Form":"Telehealth Request"}]})},trackPhoneClick:(t,n="header")=>{e("Contact",{contents:[{content_type:"service",content_name:`Phone Click - ${n}`}]})},trackServiceView:(t,n)=>{e("ViewContent",{contents:[{content_type:"service",content_name:t,content_id:n}]})},trackTelehealthClick:(t="button")=>{e("ClickButton",{contents:[{content_type:"service",content_name:`Telehealth Button - ${t}`}]})},trackAppointmentClick:(t="button")=>{e("ClickButton",{contents:[{content_type:"service",content_name:`Schedule Appointment - ${t}`}]})}}}export{l as C,m as u};
