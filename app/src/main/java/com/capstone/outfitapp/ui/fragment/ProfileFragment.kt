package com.capstone.outfitapp.ui.fragment

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.capstone.outfitapp.R
import com.capstone.outfitapp.databinding.FragmentProfileBinding
import com.capstone.outfitapp.ui.authentication.SignActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn.getClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth

class ProfileFragment : Fragment() {

    private var photoUrl: String? = null
    private var name: String? = null
    private var id: String? = null
    private var auth = FirebaseAuth.getInstance()
    lateinit var binding: FragmentProfileBinding

    companion object {
        private const val ARG_IMG_PROFILE = "img_profile"
        private const val ARG_NAME = "name"
        private const val ARG_ID = "id"

        fun newInstance(imgProfile: String?, name: String?, id: String?): ProfileFragment {
            val fragment = ProfileFragment()
            val args = Bundle()
            args.putString(ARG_IMG_PROFILE, imgProfile)
            args.putString(ARG_NAME, name)
            args.putString(ARG_ID, id)
            fragment.arguments = args
            return fragment
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Inflate the layout for this fragment
        binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if (arguments != null) {

            name = arguments?.getString(ARG_NAME)
            photoUrl = arguments?.getString(ARG_IMG_PROFILE)
            id = arguments?.getString(ARG_ID)
        }

        if ((photoUrl != null) && (name != null && (id != null))) {
            binding.pName.text = name
            binding.id.text = getString(R.string.your_id, id)
            Glide.with(requireActivity())
                .load(photoUrl)
                .apply(RequestOptions.circleCropTransform())
                .into(binding.pImgProfile)

        } else {
            binding.pName.text = getString(R.string.unknown_user)
            binding.pImgProfile.setImageResource(R.drawable.avatar)
            binding.id.text = getString(R.string.your_id_is_nothing)
        }

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        val googleSignInClient = getClient(requireActivity(), gso)

        binding.btnLogout.setOnClickListener{
            auth.signOut()
            googleSignInClient.signOut()
                .addOnCompleteListener {
                    val intent = Intent(requireActivity(), SignActivity::class.java)
                    startActivity(intent)
                }
        }
    }
}