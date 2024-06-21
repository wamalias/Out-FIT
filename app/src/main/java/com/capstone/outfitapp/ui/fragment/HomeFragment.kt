package com.capstone.outfitapp.ui.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.capstone.outfitapp.R
import com.capstone.outfitapp.databinding.FragmentHomeBinding
import com.google.firebase.auth.FirebaseAuth

class HomeFragment : Fragment() {

    private var photoUrl: String? = null
    private var name: String? = null
    private var id: String? = null

    lateinit var binding: FragmentHomeBinding
    private var auth = FirebaseAuth.getInstance()

    companion object {
        private const val ARG_IMG_PROFILE = "img_profile"
        private const val ARG_NAME = "name"
        private const val ARG_ID = "id"

        fun newInstance(imgProfile: String?, name: String?, id: String?): HomeFragment {
            val fragment = HomeFragment()
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
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.button1.setOnClickListener {
            Toast.makeText(requireContext(), "Galery", Toast.LENGTH_SHORT).show()
        }

        binding.button2.setOnClickListener {
            Toast.makeText(requireContext(), "Camera", Toast.LENGTH_SHORT).show()
        }

        if (arguments != null) {
            name = arguments?.getString(ARG_NAME)
            photoUrl = arguments?.getString(ARG_IMG_PROFILE)
            id = arguments?.getString(ARG_ID)
        }

        if ((photoUrl != null) && (name != null)) {
            binding.name.text = name
            Glide.with(requireActivity())
                .load(photoUrl)
                .apply(RequestOptions.circleCropTransform())
                .into(binding.imgProfile)

        } else {
            binding.name.text = getString(R.string.unknown_user)
            binding.imgProfile.setImageResource(R.drawable.avatar)
        }

        binding.tvImage.setImageResource(R.drawable.photo)
    }
}